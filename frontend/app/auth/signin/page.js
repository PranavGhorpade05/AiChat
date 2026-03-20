"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container, Box, Button, Typography, Paper,CircularProgress  } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import styles from "../../styles/auth.module.css";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleGoogleSignIn = () => {
    signIn("google", { redirect: false }).then((result) => {
      if (result?.ok) {
        router.push("/");
      }
    });
  };

  if (status === "loading") {
    return (
      <Box className={styles.loadingContainer}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress sx={{ color: "linear-gradient(135deg, #ff8c00, #ffa500)" }}/>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box className={styles.signInContainer}>
        <Paper elevation={3} className={styles.signInPaper}>
          <Typography variant="h4" className={styles.title}>
            AI Chat Application
          </Typography>
          <Typography variant="body1" className={styles.subtitle}>
            Sign in to continue
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            className={styles.googleButton}
            fullWidth
          >
            Sign in with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
