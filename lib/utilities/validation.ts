
import validator from 'validator';
import { isEmpty, capitalize } from 'lodash';

interface IError {

}

interface IFieldRequirements {
  dataSet: {
    [key: string] : string | number
  }
  fieldName: string
  errorLabel: string
  min: number
  max: number
  type: string
  required: boolean
}
/**
 * Checks for error if required is true
 * and adds Error and Sanitized data to the errors and sanitizedData object respectively.
 *
 * @param {String} fieldName Field name e.g. First name, last name
 * @param {String} errorContent Error Content to be used in showing error e.g. First Name, Last Name
 * @param {Integer} min Minimum characters required
 * @param {Integer} max Maximum characters required
 * @param {String} type Type e.g. email, phone etc.
 * @param {boolean} required Required if required is passed as false, it will not validate error and just do sanitization.
 */
const createErrorAndSanitizedData = ({dataSet, fieldName, errorLabel, min, max, type = '', required}: IFieldRequirements ) => {
  let errors = {};
  let sanitizedData = {}
  /**
   * Please note that this isEmpty() belongs to validator and not our custom function defined above.
   *
   * Check for error and if there is no error then sanitize data.
   */
  if ( ! validator.isLength( dataSet[ fieldName ], { min, max } ) ) {
    errors[ fieldName ] = `${errorLabel} must be ${min} to ${max} characters`;
  }

  if ( required && validator.isEmpty( dataSet[ fieldName ] ) ) {
    errors[ fieldName ] = `${errorLabel} is required`;
  }


  // If no errors
  if ( ! errors[ fieldName ] ) {
    sanitizedData[ fieldName ] = validator.trim( dataSet[ fieldName ] );
    sanitizedData[ fieldName ] = validator.escape( sanitizedData[ fieldName ] );
  }

  return {
    errors,
    sanitizedData
  }

};

interface IValidateForm {
  data: any
  defaultData: {
    [key: string]: string | number
  }
}

export const validateAndSanitizeData = ({data, defaultData}: IValidateForm ) => {

  let errors = {};
  let _sanitizedData = defaultData
  // let sanitizedData = {
  //   password: ''
  // };
  const dataKeys: string[] = Object.keys(data)

  // check if the value is empty or no strings
  dataKeys.forEach(key => {
    data[key] = ( ! isEmpty( data[key] ) ) ? data[key] : '';
    const result = createErrorAndSanitizedData({
      dataSet: data,
      fieldName: key,
      errorLabel: capitalize(key),
      min: 2,
      max: 35,
      type: 'string',
      required: true
    })
    errors = {
      ...errors,
      ...result.errors
    }

    _sanitizedData = {
      ..._sanitizedData,
      ...result.sanitizedData
    }
  })

  return {
    sanitizedData: _sanitizedData,
    errors,
    isValid: isEmpty( errors )
  };
};
