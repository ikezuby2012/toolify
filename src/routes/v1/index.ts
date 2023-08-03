import express, { Router } from "express";
import docsRoute from "./swagger.route";
import authRoute from "./auth.route";
import toolRoute from "./tool.route";
// import config from "../../config";

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  // documentation
  {
    path: "/docs",
    route: docsRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  { path: "/tool", route: toolRoute },
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if ((process.env.NODE_ENV as string) === "development") {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
