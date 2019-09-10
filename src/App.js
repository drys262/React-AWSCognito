import React, { Component } from "react";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from "amazon-cognito-identity-js";
import "./App.css";

// Avazoo User Pool
const poolData = {
  UserPoolId: "<your user pool id>", // Your user pool id here
  ClientId: "<your app client id>" // Your client id here
};

const userPool = new CognitoUserPool(poolData);

class App extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    isVerifying: false,
    code: ""
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onVerifyEmail = e => {
    e.preventDefault();
    const { firstName, lastName, email } = this.state;

    const dataEmail = {
      Name: "email",
      Value: email
    };
    const dataGivenName = {
      Name: "given_name",
      Value: firstName
    };
    const dataLastName = {
      Name: "family_name",
      Value: lastName
    };

    const attributeGivenName = new CognitoUserAttribute(dataGivenName);
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributeLastName = new CognitoUserAttribute(dataLastName);

    const attributeList = [
      attributeGivenName,
      attributeEmail,
      attributeLastName
    ];

    userPool.signUp(email, email, attributeList, null, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      this.setState({
        isVerifying: true
      });
    });
  };

  onSubmitCode = e => {
    e.preventDefault();
    const { code, email } = this.state;
    const userData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log("call result in confirm registration: " + result);
    });
  };

  onResendCode = e => {
    e.preventDefault();
    const { email } = this.state;

    const userData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function(err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log("call result in resend confirmation code: " + result);
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onVerifyEmail}>
          <input
            type="text"
            placeholder="Enter first name"
            name="firstName"
            onChange={this.handleChange}
          />
          <input
            type="text"
            placeholder="Enter last name"
            name="lastName"
            onChange={this.handleChange}
          />
          <input
            type="email"
            placeholder="Enter email here"
            name="email"
            onChange={this.handleChange}
          />
          <input type="submit" value="Verify" />
        </form>

        {this.state.isVerifying && (
          <form onSubmit={this.onSubmitCode}>
            <input
              type="text"
              placeholder="Enter code here"
              name="code"
              onChange={this.handleChange}
            />
            <input type="submit" value="Submit" />
            <button type="button" onClick={this.onResendCode}>
              Resend Code
            </button>
          </form>
        )}
      </div>
    );
  }
}

export default App;
