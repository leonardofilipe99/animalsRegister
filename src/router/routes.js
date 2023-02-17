import LayoutDefault from "../layouts/default";
import PageIndex from "../pages/indext";
import FourOhFour from "../pages/404";
import AddAnimal from "../pages/AddAnimal";
import InsertData from "../pages/InsertData";
import Record from "../pages/Record";
import About from "../pages/About";

export default [
  {
    path: "/",
    component: LayoutDefault,
    children: [
      { path: "/home", component: PageIndex },
      { path: "/add-animal/:number?", component: AddAnimal },
      { path: "/insert-data/:number?", component: InsertData },
      { path: "/record", component: Record },
      { path: "/about", component: About }
    ]
  },
  {
    path: "*",
    component: FourOhFour // () => import('../pages/404')
  }
];
