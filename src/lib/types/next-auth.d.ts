
declare module "next-auth" {
  // Defining the shape of the user insdie the session
    interface Session {
      user: {
        id: number;
        name: string;
        email: string;
        accessToken: string;
      };
    }
  }