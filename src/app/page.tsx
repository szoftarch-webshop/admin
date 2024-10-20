"use client";

import { Typography } from "@mui/material";
import AuthorizeView from "./components/AuthorizedView";
import Dashboard from "./dashboard/Dashboard";

export default function Home() {
  return (
    <AuthorizeView>
      <Typography>
        <Dashboard></Dashboard>
      </Typography>
    </AuthorizeView>
  );
}
