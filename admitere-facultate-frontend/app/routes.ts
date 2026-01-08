import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("admin", "routes/admin/layout.tsx", [
    index("routes/admin/index.tsx"),
    route("facultati", "routes/admin/facultati.tsx"),
    route("programe-studiu", "routes/admin/programe-studiu.tsx"),
    route("candidati", "routes/admin/candidati.tsx"),
    route("dosare", "routes/admin/dosare.tsx"),
    route("optiuni", "routes/admin/optiuni.tsx"),
    route("rezultate", "routes/admin/rezultate.tsx"),
    route("rapoarte", "routes/admin/rapoarte.tsx"),
    route("admini", "routes/admin/admini.tsx"),
  ]),
] satisfies RouteConfig;
