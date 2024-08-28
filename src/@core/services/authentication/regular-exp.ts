export const ReqularExp = {
  "REG_EXP": {
    "EMAIL_VALIDATION": {
      'regex': /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'message': 'Please enter a valid email address'
    },
    "EMPTY_VALIDATION": {
      'regex': /^(?! *$)[0-9a-zA-Z.+ ,@'-]+$/,
      'message': 'Please fill in the details'
    },
    "PASSWORD_VALIDATION": {
      'regex': /^(?=.{8,}$)(?=.*[a-z])(?=.*\W).*$/,
      'message': 'Min 8 characters, atleast 1 lowercase and 1 special character'
    },
  }

}