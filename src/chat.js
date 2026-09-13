import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';

const COMMON_EMOJIS = ['😂','❤️','😍','🤣','🙏','👍','😭','🔥','🥰','✨','😊','😎','🤔','🎉','👀','💯','💔','🙌','✌️','🫶'];
const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '🙏', '👍'];

const ChatApp = () => {
  const [username, setUsername] = useState(() => localStorage.getItem('whatsapp_username') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('whatsapp_username'));
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [typingUser, setTypingUser] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); 
  const [showEmojis, setShowEmojis] = useState(false); 
  const [activeReactionMsg, setActiveReactionMsg] = useState(null); 
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const broadcastChannelRef = useRef(null);
  
  const pressTimer = useRef(null);
  const isLongPressRef = useRef(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      if (!error && data) setMessages(data);
    };
    fetchMessages();

    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages((current) => [...current, payload.new]);
          setTypingUser(null);
        } else if (payload.eventType === 'UPDATE') {
          setMessages((current) => current.map((msg) => msg.id === payload.new.id ? payload.new : msg));
        }
      }).subscribe();

    const roomChannel = supabase.channel('chat-room', {
      config: { broadcast: { self: false }, presence: { key: username } }
    });

    roomChannel
      .on('presence', { event: 'sync' }, () => {
        const state = roomChannel.presenceState();
        setOnlineUsers(Object.keys(state).map((key) => state[key][0].username));
      })
      .on('broadcast', { event: 'typing' }, (payload) => {
        setTypingUser(payload.payload.username);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await roomChannel.track({ username: username });
      });

    broadcastChannelRef.current = roomChannel;

    return () => {
      supabase.removeChannel(messageSubscription);
      supabase.removeChannel(roomChannel);
    };
  }, [isLoggedIn, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== '') {
      localStorage.setItem('whatsapp_username', username.trim());
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('whatsapp_username');
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const clearAttachment = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAudioBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTextChange = (e) => {
    setNewMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;

    if (broadcastChannelRef.current && username) {
      broadcastChannelRef.current.send({ type: 'broadcast', event: 'typing', payload: { username: username } });
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojis(false);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const toggleReaction = async (msg, emoji) => {
    setActiveReactionMsg(null); 
    let currentReactions = JSON.parse(JSON.stringify(msg.reactions || {}));
    
    if (currentReactions[emoji] && currentReactions[emoji].includes(username)) {
      currentReactions[emoji] = currentReactions[emoji].filter((user) => user !== username);
      if (currentReactions[emoji].length === 0) delete currentReactions[emoji];
    } else {
      if (!currentReactions[emoji]) currentReactions[emoji] = [];
      currentReactions[emoji].push(username);
    }

    setMessages(currentMessages => currentMessages.map(m => m.id === msg.id ? { ...m, reactions: currentReactions } : m));
    await supabase.from('messages').update({ reactions: currentReactions }).eq('id', msg.id);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/mp4' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      alert("Microphone blocked! Are you on HTTP instead of HTTPS? Check your browser permissions.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      setAudioBlob(null);
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (newMessage.trim() === '' && !selectedFile && !audioBlob) return;

    setIsUploading(true);
    let finalImageUrl = null;
    let finalAudioUrl = null;

    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('chat-images').upload(fileName, selectedFile);
      if (!uploadError) {
        const { data } = supabase.storage.from('chat-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }
    }

    if (audioBlob) {
      let fileExt = 'webm';
      if (audioBlob.type.includes('mp4')) fileExt = 'm4a';
      if (audioBlob.type.includes('mpeg')) fileExt = 'mp3';
      
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const { error: audioUploadError } = await supabase.storage.from('chat-audio').upload(fileName, audioBlob);
      if (!audioUploadError) {
        const { data } = supabase.storage.from('chat-audio').getPublicUrl(fileName);
        finalAudioUrl = data.publicUrl;
      }
    }

    let replyData = null;
    if (replyingTo) {
      replyData = { username: replyingTo.username, text: replyingTo.text || (replyingTo.image ? '📷 Photo' : replyingTo.audio ? '🎤 Voice Note' : 'Message') };
    }

    const { error } = await supabase.from('messages').insert([{ 
      text: newMessage.trim(), 
      username: username,
      image: finalImageUrl,
      audio: finalAudioUrl,
      reply_to: replyData
    }]);

    if (!error) {
      setNewMessage('');
      clearAttachment();
      setReplyingTo(null); 
      setShowEmojis(false);
      if (textareaRef.current) textareaRef.current.style.height = '40px'; 
    }
    setIsUploading(false);
  };

  const handlePressStart = (msg) => {
    isLongPressRef.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPressRef.current = true;
      setReplyingTo(msg);
      setActiveReactionMsg(null);
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    }, 500); 
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleBubbleClick = (msg) => {
    if (isLongPressRef.current) { isLongPressRef.current = false; return; }
    setActiveReactionMsg(activeReactionMsg === msg.id ? null : msg.id);
  };

  const formatTime = (isoString) => isoString ? new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const getDateLabel = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginBg}>
        <div style={styles.loginCard}>
          <div style={styles.logoBadge}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <h2 style={{ color: '#fff', marginBottom: '8px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>SYSTEM.LOGIN</h2>
          <p style={{ color: '#00f3ff', fontSize: '0.85rem', marginBottom: '24px', fontFamily: 'monospace' }}>_awaiting_user_input...</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <input type="text" value={username} placeholder="ENTER ALIAS" onChange={(e) => setUsername(e.target.value)} style={styles.loginInput} autoFocus />
            <button type="submit" style={styles.loginBtn}>INITIALIZE &gt;</button>
          </form>
        </div>
      </div>
    );
  }

  let lastDateLabel = null;
  const isOtherPersonOnline = onlineUsers.some(user => user !== username);
  const showSendButton = newMessage.trim() !== '' || selectedFile || audioBlob;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.chatContainer}>
        {activeReactionMsg && (
          <div style={styles.clickCaptureOverlay} onClick={(e) => { e.stopPropagation(); setActiveReactionMsg(null); }} />
        )}

        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <div style={styles.avatar}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <h3 style={styles.headerTitle}>SECURE_CHANNEL</h3>
              <p style={styles.headerSubtitle}>
                {typingUser ? <span style={{ color: '#ff00e6', fontWeight: '600', animation: 'blink 1s infinite' }}>[{typingUser} input_detected...]</span> : isOtherPersonOnline ? <span style={{ color: '#00ff66', textShadow: '0 0 5px #00ff66'}}>● NETWORK_ACTIVE</span> : 'SYS_IDLE'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>[ ABORT ]</button>
        </div>

        <div style={styles.chatWindow}>
          {messages.map((msg) => {
            const isMe = msg.username === username;
            const currentDateLabel = getDateLabel(msg.created_at);
            const showDateSeparator = currentDateLabel !== lastDateLabel;
            lastDateLabel = currentDateLabel;

            return (
              <React.Fragment key={msg.id}>
                {showDateSeparator && (
                  <div style={styles.dateSeparatorWrapper}>
                    <span style={styles.dateSeparator}>-- {currentDateLabel} --</span>
                  </div>
                )}

                <div 
                  style={{...(isMe ? styles.rowMe : styles.rowThem), zIndex: activeReactionMsg === msg.id ? 11 : 1 }}
                  onMouseDown={() => handlePressStart(msg)}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressEnd}
                  onTouchStart={() => handlePressStart(msg)}
                  onTouchEnd={handlePressEnd}
                  onTouchMove={handlePressEnd}
                  onClick={() => handleBubbleClick(msg)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div style={isMe ? styles.bubbleMe : styles.bubbleThem}>
                    
                    {activeReactionMsg === msg.id && (
                      <div style={isMe ? styles.reactionMenuMe : styles.reactionMenuThem} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                        {REACTION_EMOJIS.map(emoji => (
                          <span key={emoji} style={styles.reactionOption} onClick={(e) => { e.stopPropagation(); toggleReaction(msg, emoji); }}>{emoji}</span>
                        ))}
                      </div>
                    )}

                    {msg.reply_to && (
                      <div style={isMe ? styles.quotedMessageInsideMe : styles.quotedMessageInsideThem} dir="auto">
                        <span style={isMe ? styles.quotedUserInsideMe : styles.quotedUserInsideThem}>&gt; {msg.reply_to.username}</span>
                        <p style={styles.quotedTextInside} dir="auto">{msg.reply_to.text}</p>
                      </div>
                    )}

                    {!isMe && <div style={styles.senderName}>{msg.username || 'UNKNOWN_USER'}</div>}
                    
                    {msg.image && <img src={msg.image} alt="attachment" style={styles.messageImage} />}
                    {msg.audio && (
                      <div style={styles.audioPlayerWrapper} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                        <audio src={msg.audio} controls style={{...styles.audioPlayer, filter: 'invert(0.9) hue-rotate(180deg)'}} />
                      </div>
                    )}
                    
                    {msg.text && <div style={{...styles.messageText, color: '#e0e6ed'}} dir="auto">{msg.text}</div>}
                    
                    <div style={styles.metaContainer}>
                      <span style={{...styles.timestamp, color: isMe ? '#00f3ff' : '#ff00e6'}}>{formatTime(msg.created_at)}</span>
                      {isMe && <span style={styles.ticks}>//</span>}
                    </div>

                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div style={isMe ? styles.reactionBadgeMe : styles.reactionBadgeThem} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                        {Object.entries(msg.reactions).map(([emoji, users]) => {
                          const hasReacted = users.includes(username);
                          return (
                            <span 
                              key={emoji} title={users.join(', ')} 
                              style={{...styles.reactionBadgeIcon, borderColor: hasReacted ? (isMe ? '#00f3ff' : '#ff00e6') : '#333'}}
                              onClick={(e) => { e.stopPropagation(); toggleReaction(msg, emoji); }}
                            >
                              {emoji} <span style={{fontSize: '0.65rem', marginLeft: '4px', color: '#fff'}}>{users.length > 1 ? users.length : ''}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}

                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {showEmojis && (
          <div style={styles.emojiPicker}>
            {COMMON_EMOJIS.map((emoji) => (
              <span key={emoji} style={styles.emojiItem} onClick={() => handleEmojiClick(emoji)}>{emoji}</span>
            ))}
          </div>
        )}

        {replyingTo && (
          <div style={styles.replyPreviewArea} dir="auto">
            <div style={styles.replyPreviewContent}>
              <span style={styles.replyPreviewUser}>TARGETING: {replyingTo.username}</span>
              <p style={styles.replyPreviewText} dir="auto">{replyingTo.text || '[ ENCRYPTED MEDIA ]'}</p>
            </div>
            <button onClick={() => setReplyingTo(null)} style={styles.closeReplyBtn}>[X]</button>
          </div>
        )}

        {previewUrl && (
          <div style={styles.previewContainer}>
            <div style={styles.previewWrapper}>
              <img src={previewUrl} alt="Preview" style={styles.previewImg} />
              <button onClick={clearAttachment} style={styles.removeImgBtn} disabled={isUploading}>[X]</button>
            </div>
          </div>
        )}

        {audioBlob && !isRecording && (
          <div style={styles.previewContainer}>
             <audio src={URL.createObjectURL(audioBlob)} controls style={{width: '100%', filter: 'invert(0.9) hue-rotate(180deg)'}} />
             <button onClick={clearAttachment} style={styles.removeAudioBtn} disabled={isUploading}>[X]</button>
          </div>
        )}

        <div style={styles.inputArea}>
          {isRecording ? (
            <div style={styles.recordingUI}>
              <div style={styles.recordingIndicator}><span style={styles.redDot}></span> AUDIO_CAPTURE: {formatRecordingTime(recordingTime)}</div>
              <div style={{display: 'flex', gap: '15px'}}>
                <button onClick={cancelRecording} style={styles.cancelRecBtn}>[ ABORT ]</button>
                <button onClick={stopRecording} style={styles.stopRecBtn}>[ SAVE ]</button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => fileInputRef.current.click()} style={styles.iconBtn} disabled={isUploading || audioBlob}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />
              
              <div style={styles.inputWrapper}>
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  placeholder={isUploading ? "UPLOADING_DATA..." : "ENTER_COMMAND..."}
                  onChange={handleTextChange}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  style={styles.textArea}
                  rows={1}
                  disabled={isUploading || audioBlob}
                  dir="auto"
                />
                <button onClick={() => setShowEmojis(!showEmojis)} style={styles.inlineEmojiBtn}>
                   ☻
                </button>
              </div>
            </>
          )}

          {!isRecording && (
            showSendButton ? (
              <button onClick={sendMessage} style={styles.sendBtn} disabled={isUploading}>
                {isUploading ? "⏳" : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a12" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
              </button>
            ) : (
              <button onClick={startRecording} style={styles.micBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
};

// --- CYBERPUNK / NEON DARK STYLES ---
const darkBg = '#06070d';
const panelBg = '#10121a';
const neonCyan = '#00f3ff';
const neonPink = '#ff00e6';
const neonGreen = '#00ff66';

const styles = {
  loginBg: { height: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: `radial-gradient(circle at center, #10121a 0%, ${darkBg} 100%)`, fontFamily: '"Courier New", Courier, monospace' },
  loginCard: { backgroundColor: panelBg, padding: '40px', border: `1px solid ${neonCyan}`, boxShadow: `0 0 20px rgba(0, 243, 255, 0.2), inset 0 0 10px rgba(0, 243, 255, 0.1)`, width: '90%', maxWidth: '380px', textAlign: 'center', position: 'relative' },
  logoBadge: { width: '64px', height: '64px', border: `2px solid ${neonCyan}`, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px', boxShadow: `0 0 10px ${neonCyan}` },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  loginInput: { padding: '16px', backgroundColor: 'transparent', border: 'none', borderBottom: `2px solid #333`, color: '#fff', fontSize: '1rem', outline: 'none', textAlign: 'center', transition: 'border-color 0.3s', fontFamily: '"Courier New", Courier, monospace', letterSpacing: '1px' },
  loginBtn: { padding: '16px', background: 'transparent', color: neonCyan, border: `1px solid ${neonCyan}`, fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '2px', textTransform: 'uppercase' },
  pageContainer: { height: '100dvh', display: 'flex', justifyContent: 'center', backgroundColor: '#000', fontFamily: '"Courier New", Courier, monospace' },
  chatContainer: { width: '100%', maxWidth: '800px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: darkBg, borderLeft: `1px solid #1a1a2e`, borderRight: `1px solid #1a1a2e`, zIndex: 1 },
  clickCaptureOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, backgroundColor: 'transparent' },
  header: { backgroundColor: panelBg, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 12, borderBottom: `2px solid ${neonCyan}`, boxShadow: `0 4px 15px rgba(0, 243, 255, 0.1)` },
  headerInfo: { display: 'flex', alignItems: 'center', gap: '16px' },
  avatar: { width: '40px', height: '40px', background: neonCyan, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: `0 0 10px ${neonCyan}` },
  headerTitle: { margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px' },
  headerSubtitle: { margin: 0, color: '#6B7280', fontSize: '0.8rem', minHeight: '16px', marginTop: '4px', fontFamily: '"Courier New", Courier, monospace' },
  logoutBtn: { backgroundColor: 'transparent', color: neonPink, border: `1px solid ${neonPink}`, padding: '6px 12px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px' },
  chatWindow: { flex: 1, padding: '24px 5%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: darkBg, paddingBottom: '30px', backgroundImage: 'radial-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' },
  dateSeparatorWrapper: { display: 'flex', justifyContent: 'center', margin: '20px 0' },
  dateSeparator: { backgroundColor: 'transparent', color: '#555', fontSize: '0.8rem', letterSpacing: '2px' },
  rowMe: { display: 'flex', justifyContent: 'flex-end', width: '100%', cursor: 'pointer', position: 'relative' },
  rowThem: { display: 'flex', justifyContent: 'flex-start', width: '100%', cursor: 'pointer', position: 'relative' },
  bubbleMe: { backgroundColor: '#111520', borderRight: `3px solid ${neonCyan}`, padding: '12px 16px', maxWidth: '75%', minWidth: '80px', position: 'relative', boxShadow: `0 4px 10px rgba(0,0,0,0.5)`, marginBottom: '8px' },
  bubbleThem: { backgroundColor: '#111520', borderLeft: `3px solid ${neonPink}`, padding: '12px 16px', maxWidth: '75%', minWidth: '80px', position: 'relative', boxShadow: `0 4px 10px rgba(0,0,0,0.5)`, marginBottom: '8px' },
  reactionMenuMe: { position: 'absolute', top: '-46px', right: '0', backgroundColor: panelBg, border: `1px solid ${neonCyan}`, padding: '6px 12px', display: 'flex', gap: '10px', boxShadow: `0 0 15px rgba(0, 243, 255, 0.2)`, zIndex: 20 },
  reactionMenuThem: { position: 'absolute', top: '-46px', left: '0', backgroundColor: panelBg, border: `1px solid ${neonPink}`, padding: '6px 12px', display: 'flex', gap: '10px', boxShadow: `0 0 15px rgba(255, 0, 230, 0.2)`, zIndex: 20 },
  reactionOption: { fontSize: '1.4rem', cursor: 'pointer', transition: 'transform 0.1s', filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' },
  reactionBadgeMe: { position: 'absolute', bottom: '-12px', right: '12px', display: 'flex', gap: '4px', backgroundColor: panelBg, padding: '2px 6px', border: `1px solid #333`, zIndex: 5 },
  reactionBadgeThem: { position: 'absolute', bottom: '-12px', left: '12px', display: 'flex', gap: '4px', backgroundColor: panelBg, padding: '2px 6px', border: `1px solid #333`, zIndex: 5 },
  reactionBadgeIcon: { fontSize: '0.8rem', display: 'flex', alignItems: 'center', padding: '0 4px', cursor: 'pointer' },
  quotedMessageInsideMe: { backgroundColor: 'rgba(0, 243, 255, 0.05)', borderLeft: `2px solid ${neonCyan}`, padding: '8px 10px', marginBottom: '10px', fontSize: '0.85rem' },
  quotedMessageInsideThem: { backgroundColor: 'rgba(255, 0, 230, 0.05)', borderLeft: `2px solid ${neonPink}`, padding: '8px 10px', marginBottom: '10px', fontSize: '0.85rem' },
  quotedUserInsideMe: { color: neonCyan, display: 'block', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' },
  quotedUserInsideThem: { color: neonPink, display: 'block', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' },
  quotedTextInside: { margin: 0, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  replyPreviewArea: { backgroundColor: panelBg, padding: '12px 20px', borderTop: `1px solid #333`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 12 },
  replyPreviewContent: { borderLeft: `2px solid ${neonGreen}`, paddingLeft: '12px', flex: 1, marginRight: '16px' },
  replyPreviewUser: { color: neonGreen, fontSize: '0.85rem', display: 'block', marginBottom: '4px', letterSpacing: '1px' },
  replyPreviewText: { margin: 0, color: '#aaa', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  closeReplyBtn: { background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'monospace' },
  senderName: { fontSize: '0.8rem', color: neonPink, marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' },
  messageText: { fontSize: '1rem', whiteSpace: 'pre-wrap', wordWrap: 'break-word', lineHeight: '1.5', unicodeBidi: 'plaintext', fontFamily: '"Courier New", Courier, monospace' },
  messageImage: { width: '100%', marginBottom: '8px', maxHeight: '300px', objectFit: 'cover', border: '1px solid #333' },
  audioPlayerWrapper: { marginTop: '5px', marginBottom: '5px' },
  audioPlayer: { height: '40px', width: '220px', outline: 'none' },
  recordingUI: { flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', backgroundColor: '#1a0505', border: '1px solid #ff0000', height: '48px' },
  recordingIndicator: { color: '#ff0000', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' },
  redDot: { width: '8px', height: '8px', backgroundColor: '#ff0000', borderRadius: '50%', animation: 'blink 1s linear infinite', boxShadow: '0 0 8px #ff0000' },
  cancelRecBtn: { background: 'transparent', border: '1px solid #666', color: '#888', cursor: 'pointer', fontSize: '0.8rem', padding: '4px 8px' },
  stopRecBtn: { background: '#ff0000', color: '#fff', border: 'none', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', textShadow: '0 0 5px #fff' },
  micBtn: { background: 'transparent', color: neonCyan, border: `1px solid ${neonCyan}`, width: '44px', height: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' },
  metaContainer: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '8px', float: 'right', marginLeft: '12px' },
  timestamp: { fontSize: '0.7rem', fontFamily: 'monospace' },
  ticks: { fontSize: '0.8rem', color: neonCyan, letterSpacing: '1px' },
  previewContainer: { backgroundColor: panelBg, padding: '16px 20px', borderTop: `1px solid #333`, zIndex: 12 },
  previewWrapper: { position: 'relative', display: 'inline-block' },
  previewImg: { height: '100px', border: `1px solid ${neonCyan}`, objectFit: 'cover' },
  removeImgBtn: { position: 'absolute', top: '-10px', right: '-10px', background: '#000', color: neonPink, border: `1px solid ${neonPink}`, width: '24px', height: '24px', cursor: 'pointer', fontSize: '0.7rem' },
  removeAudioBtn: { position: 'absolute', top: '24px', right: '30px', background: '#000', color: neonPink, border: `1px solid ${neonPink}`, width: '24px', height: '24px', cursor: 'pointer', fontSize: '0.7rem' },
  emojiPicker: { backgroundColor: panelBg, borderTop: `1px solid ${neonCyan}`, padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxHeight: '200px', overflowY: 'auto', zIndex: 12 },
  emojiItem: { fontSize: '1.6rem', cursor: 'pointer', userSelect: 'none', padding: '4px', filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' },
  inputArea: { backgroundColor: panelBg, padding: '12px 16px 20px 16px', display: 'flex', alignItems: 'flex-end', gap: '10px', zIndex: 12, borderTop: `1px solid #1a1a2e` },
  iconBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  inputWrapper: { flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#0a0a12', border: `1px solid #333`, paddingRight: '4px', transition: 'border-color 0.3s' },
  textArea: { flex: 1, padding: '12px 16px', border: 'none', outline: 'none', fontSize: '1rem', resize: 'none', backgroundColor: 'transparent', maxHeight: '120px', overflowY: 'auto', fontFamily: '"Courier New", Courier, monospace', color: '#fff' },
  inlineEmojiBtn: { background: 'transparent', color: '#fff', border: 'none', fontSize: '1.2rem', padding: '8px 12px', cursor: 'pointer' },
  sendBtn: { background: neonCyan, color: '#000', border: 'none', width: '44px', height: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: `0 0 15px rgba(0, 243, 255, 0.4)` }
};

export default ChatApp;