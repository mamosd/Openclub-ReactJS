/**
 * List of error based validation functions and related messages
 */
 import la from 'logandarrow'

export const required = val => !val || val.length <= 0 ?
  'This field must have a value.' : undefined

export const minLength = len => val => !val || val.length < len ?
  `This field must be at least ${len} characters long.` : undefined

export const maxLength = len => val => val && val.length > len ?
  `This field must be no more than ${len} characters long.` : undefined

export const email = val => val && !val.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) ?
  'Please enter a valid email address.' : undefined

export const phone = val => val && !val.match(/^[\d\s()+]{6,}/) ?
  'Please enter a valid phone number.' : undefined

export const name = val => val && !val.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$/) ?
  'Names can only contain dictionary characters (a-z) and punctuation (\',-.).' : undefined

export const object_name = val => val && !val.match(/^[\w\s\d'-]+$/) ?
  'Names must contain only dictionary characters, punctuation, underscores and numbers.' : undefined

export const slug = val => val && !val.match(/^[\w\d]+(?:-[\w\d]+)*$/) ?
  'URLs can only contain lowercase letters (a-z), numbers (0-9) and hyphens (-), and cannot start or end with a hyphen (-).' : undefined

export const reservedSlugs = val => val && val.match(/^(test|admin|openclub|feed|events|club|clubs|discover|notifications|profile|create|join|legal|privacy|terms|termsofservice|privacypolicy|index|default)$/) ?
  'URLs cannot use reserved words.' : undefined

export const abn = val => val && !val.match(/^(\d *?){9,11}$/) ?
  'Please enter a valid Australian Business Number (ABN).' : undefined

export const vat = val => val && !val.match(/^[\w]{2}?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})$/) ?
  'Please enter a valid VAT number.' : undefined

export const nzbn = val => val && !val.match(/^(\d *?){13}$/) ?
  'Please enter a valid New Zealand Business Number (NZBN).' : undefined

export const number = val => val && !val.match(/^[\d]+$/) ?
  'Please only enter numbers.' : undefined

export const money = val => val && !val.match(/^[+-]?[0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)$/) ?
  'Please enter a valid monetary amount' : undefined

export const url = val => val && !val.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi) ?
  'Please enter a valid URL' : undefined

export const empty = () => undefined;

export const australianBSB = val => !val.match(/^[\d]{6}$/) ? 'Please enter a valid BSB' : undefined

export const canadaTransitNumber = val => !val.match(/^[\d]{5}$/) ? 'Please enter a valid transit number' : undefined

export const canadaInstituteNumber = val => !val.match(/^[\d]{3}$/) ? 'Please enter a valid institute number' : undefined

export const singaporeBankCode = val => !val.match(/^[\d]{4}$/) ? 'Plese enter a valid bank code' : undefined

export const singaporeBranchCode = val => !val.match(/^[\d]{3}$/) ? 'Please enter a valid branch code' : undefined

export const ieIBAN = val => !val.match(/^IE\d{2}[A-Z]{4}\d{14}$/) ? 'Please enter a valid Ireland IBAN' : undefined

export const gbIBAN = val => !val.match(/^GB\d{2}[A-Z]{4}\d{14}$/) ? 'Please enter a valid Great Britain IBAN' : undefined
