# Expense_Management
Expense_Management system helps user to manage their expense, contribution in expense, monthly expense report and expense history.

#Requirements

Node and MongoDB latest version

#setUp

Clone this repo  and run npm install to install all the dependencies.
You might want to look into config.json to make change the port you want to use.

#Usage

After you clone this repo , go to its root directory and run npm install to install its dependencies.
Once the dependencies are installed, you can run **node server.js** to start the application. You will then be able to access it at localhost:8080

 * server.js file contain all the basic configuration for system and environment setup.
 
 * env directory contain environment setup files
 
 * helper directory contain basic validation and constant messages files where you can setup your system constant messages and validation
 
 * middleware directory contain auth validate file where you can verify users based on their token 
 
 * models directory contain system models
 
 * routes directory contain basic routes for system API  
 
 * controller directory contain userCtrl and expenseCtrl.
 
	  - In userCtrl API :(Basic path ex.  **http://localhost:8080/api/user/userRegister**)
  
			1) userRegister : you can create user by passing  user-model param in request parameters.
			2) login : 	pass email and password in request parameters
			3) forgotPassword : you can get your password in your register email .
			4) deleteUser : delete database users 
			5) updatePassword : you can update password just pass old and new password
			6) getAllUsers : get all system users
      
    - In expenseCtrl API:(Basic path ex.  **http://localhost:8080/api/expense/addExpense**)
  
		  1) addExpense : you can add your expense also add contributor for share expense 
