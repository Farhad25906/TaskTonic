import { Outlet } from "react-router";
import CommonLayout from "./layouts/CommonLayout";


function App() {
  return (
    <CommonLayout>
      <Outlet></Outlet>
    </CommonLayout>
  );
}

export default App;