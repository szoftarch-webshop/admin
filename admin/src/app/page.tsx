"use client";

import { Typography } from "@mui/material";
import AuthorizeView from "./components/AuthorizedView";

export default function Home() {
  return (
    <AuthorizeView>
      <Typography>
        Home page
      </Typography>
    </AuthorizeView>
  );
}
