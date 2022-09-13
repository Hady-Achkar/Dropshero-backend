// @ts-ignore
import strongPasswordGenerator from 'strong-password-generator';

export default (): string => {
  return strongPasswordGenerator.generatePassword();
};