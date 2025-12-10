<?php include 'includes/header.php'; ?>
<h1>Register</h1>
<form id="registerForm" method="post" action="register.php">
  <label>Phone (ddd-ddd-dddd): <input name="phone" id="phone"></label><br>
  <label>Password: <input type="password" name="password" id="password"></label><br>
  <label>Confirm Password: <input type="password" name="confirm_password" id="confirm_password"></label><br>
  <label>First Name: <input name="first_name" id="first_name"></label><br>
  <label>Last Name: <input name="last_name" id="last_name"></label><br>
  <label>DOB (MM-DD-YYYY): <input name="dob" id="dob" placeholder="MM-DD-YYYY"></label><br>
  <label>Email: <input name="email" id="email"></label><br>
  <label>Gender:
    <input type="radio" name="gender" value="M">M
    <input type="radio" name="gender" value="F">F
    <input type="radio" name="gender" value="Other">Other
  </label><br>
  <button type="submit">Register</button>
</form>

<script src="/js/register.js"></script>
<?php include 'includes/footer.php'; ?>
