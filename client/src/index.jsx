import React from "react";
import ReactDOMClient from "react-dom/client";
import { Users } from "./screens/Users";

const app = document.getElementById("app");
const root = ReactDOMClient.createRoot(app);
root.render(<Users />);
