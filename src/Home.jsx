import {Link, Outlet} from "react-router-dom";

export default function Home(){
  return (
      <div className={"flex flex-col h-screen overflow-scroll gap-3 p-3 bg-purple-900"}>
        <div className={"bg-opacity-50 text-sm p-2 text-white rounded-2xl bg-gray-400 text-center"}>
          <Link to={"/"}>Go Home</Link>
        </div>
        <Outlet/>
      </div>
  )
}