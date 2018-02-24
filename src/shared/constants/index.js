import { australianBSB, empty, canadaTransitNumber, canadaInstituteNumber, singaporeBankCode, singaporeBranchCode, gbIBAN, ieIBAN } from 'utils/form_validation/errors'
export const formPrefix = 'ant-form'

export const durations = {
  lookup: {
    LIFETIME: 'Lifetime',
    YEARLY: 'Annually',
    BIYEARLY: 'Biannually',
    MONTHLY: 'Monthly',
    FORTNIGHTLY: 'Fortnightly',
    WEEKLY: 'Weekly'
  },
  lookupPer: {
    LIFETIME: 'one time',
    YEARLY: 'per year',
    BIYEARLY: 'twice per year',
    MONTHLY: 'per month',
    FORTNIGHTLY: 'per fortnight',
    WEEKLY: 'per week'
  },
  list: ['LIFETIME', 'YEARLY', 'BIYEARLY', 'MONTHLY', 'WEEKLY', 'FORTNIGHTLY']
}

export const countries = [
  { value: 'AU', title: 'Australia' },
  { value: 'CA', title: 'Canada' },
  { value: 'IE', title: 'Ireland' },
  { value: 'NZ', title: 'New Zealand' },
  { value: 'SG', title: 'Singapore' },
  { value: 'GB', title: 'United Kingdon' },
  { value: 'US', title: 'United States' }
]

export const bankByCountry = {
  'AU': {
    type: 2,
    taxId: 'ABN or ACN',
    routing_number: {
      name: 'BSB',
      validation: australianBSB,
      width: '30%'
    },
    account_number: {
      name: 'Account Number',
      validation: empty,
      width: '70%'
    }
  },
  'CA': {
    type: 3,
    taxId: 'Business Number',
    transit_number: {
      name: 'Transit Number',
      validation: canadaTransitNumber,
      width: '30%'
    },
    routing_number: {
      name: 'Institute Number',
      validation: canadaInstituteNumber,
      width: '30%'
    },
    account_number: {
      name: 'Account Number',
      validation: empty,
      width: '40%'
    }
  },
  'IE': {
    type: 1,
    taxId: 'Business Number',
    account_number: {
      name: 'IBAN',
      validation: ieIBAN,
      width: '100%'
    }
  },
  'NZ': {
    type: 2,
    taxId: 'NZBN',
    routing_number: {
      name: 'Bank + Branch Number',
      validation: empty,
      width: '40%'
    },
    account_number: {
      name: 'Account Number',
      validation: empty,
      width: '60%'
    }
  },
  'SG': {
    type: 3,
    taxId: 'UEN',
    transit_number: {
      name: 'Bank Code',
      validation: singaporeBankCode,
      width: '20%'
    },
    routing_number: {
      name: 'Branch Code',
      validation: singaporeBranchCode,
      width: '30%'
    },
    account_number: {
      name: 'Account Number',
      validation: empty,
      width: '50%'
    }
  },
  'GB': {
    type: 1,
    taxId: 'Company Number',
    account_number: {
      name: 'IBAN',
      validation: gbIBAN,
      width: '100%'
    }
  },
  'US': {
    type: 2,
    taxId: 'EIN',
    routing_number: {
      name: 'Routing Number',
      validation: empty,
      width: '50%'
    },
    account_number: {
      name: 'Account Number',
      validation: empty,
      width: '50%'
    }
  }
}

export const objectIcon = o => ({
  'post': 'edit',
  'club': 'team',
  'event': 'calendar',
  'test': 'edit'
}[o] || 'file-unknown')

export const defaultCategories = [
  {
    type: 'music',
    name: 'Music'
  },
  {
    type: 'motorsport',
    name: 'Motorsport'
  },
  {
    type: 'sport',
    name: 'Sport'
  },
  {
    type: 'technology',
    name: 'Technology'
  },
  {
    type: 'university',
    name: 'University'
  }
]
