// Exporting a middleware function named 'isLoggedIn'
// This function will check if a user is logged in before allowing them to continue
module.exports.isLoggedIn = (req, res, next) => {
  // If the user is not logged in
  if (!req.isAuthenticated()) {
    // Show an error message saying the user must log in first
    req.flash("error", "You must be logged in to create a listing!");

    // Redirect the user to the login page
    return res.redirect("/login");
  }

  // If the user is logged in, move on to the next middleware or route handler
  next();
};
