const LOCAL_SERVER = "http://localhost:8060";
const TEST_SERVER = "http://10.1.12.64:9096";
const HOST_SERVER_PROD = "http://10.1.12.64:8086";


export default function targetServer() {
  //---------- PRODUCTION---------
  let run_Production = false;
  //------------------------------

  //---------- Stage---------
  let run_Test = true;
  //------------------------------

  if (run_Test) {
    return TEST_SERVER;
  }
  else if (run_Production) {
    return HOST_SERVER_PROD;
  }
  else {
    return LOCAL_SERVER;
  }
}
