import React from 'react';

const PortfolioMinimal = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-24">
        
        <header className="mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Mohamed Shehta Nabwi [cite: 2]</h1>
          <h2 className="text-xl text-neutral-500 mb-6">Java Full Stack Software Engineer [cite: 9]</h2>
          <div className="flex gap-4 text-sm font-medium">
            <a href="mailto:shehta8907@gmail.com" className="text-neutral-900 hover:underline">Email [cite: 1]</a>
            <a href="#" className="text-neutral-900 hover:underline">Codeforces [cite: 6]</a>
            <a href="#" className="text-neutral-900 hover:underline">Portfolio [cite: 7]</a>
          </div>
        </header>

        <section className="mb-16">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">About</h3>
          <p className="text-lg leading-relaxed text-neutral-700">
            Detail-oriented and passionate Java Full Stack Software Engineer with strong experience in developing, maintaining, and upgrading enterprise-level applications[cite: 9]. Skilled in Spring Boot, React.js, and web technologies with a solid foundation in OOP, data structures, and database systems[cite: 10].
          </p>
        </section>

        <section className="mb-16">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Experience</h3>
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="text-lg font-bold">Senior Software Engineer [cite: 13]</h4>
                <span className="text-sm text-neutral-500">06/2023 - Present [cite: 14]</span>
              </div>
              <p className="text-neutral-600 mb-2">EI SEWEDY ELECTRIC [cite: 15]</p>
              <ul className="list-disc list-outside ml-5 text-neutral-700 space-y-1 text-sm">
                <li>Migrated Swing desktop apps to web-based applications using React.js and Spring Boot[cite: 17].</li>
                <li>Supported software systems across 4 factories[cite: 18].</li>
                <li>Upgraded Java 7 systems to Java 8[cite: 19].</li>
              </ul>
            </div>
            
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="text-lg font-bold">Software Engineer [cite: 22]</h4>
                <span className="text-sm text-neutral-500">05/2022 - 05/2023 [cite: 23]</span>
              </div>
              <p className="text-neutral-600 mb-2">Egyptian Vehicles Army HQ [cite: 22]</p>
              <ul className="list-disc list-outside ml-5 text-neutral-700 space-y-1 text-sm">
                <li>Maintained and enhanced military registration and archiving systems[cite: 24].</li>
                <li>Built a system for tracking equipment faults and repairs[cite: 26].</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Tech Stack</h3>
          <p className="text-neutral-700 leading-relaxed">
            <span className="font-bold text-neutral-900">Languages:</span> Java, JavaScript, Python, PHP, C++, C#[cite: 57].<br/>
            <span className="font-bold text-neutral-900">Backend:</span> Spring Boot, Spring MVC, Microservices, Apache Kafka, Redis[cite: 59, 61, 62].<br/>
            <span className="font-bold text-neutral-900">Frontend:</span> React.js, Laravel, AJAX[cite: 65].<br/>
            <span className="font-bold text-neutral-900">Databases:</span> SQL Server, MySQL, Oracle, Mongo[cite: 67].
          </p>
        </section>
      </div>
    </div>
  );
};

export default PortfolioMinimal;