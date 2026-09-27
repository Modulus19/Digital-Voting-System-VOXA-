const paths = {
  home: "/",
  about: "/about",

  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    verification: "/verification",
    resetPassword: "/reset-password",
  },

  user: {
    polls: "/polls",
    createPoll: "/polls/create",
    myPolls: "/my-polls",
    drafts: "/drafts",
    myVotes: "/my-votes",
    profile: "/profile",
    editProfile: "/profile/edit",
  },

  admin: {
    dashboard: "/admin",
    polls: "/admin/polls",
    users: "/admin/users",
    results: "/admin/results",
  },
};

export default paths;