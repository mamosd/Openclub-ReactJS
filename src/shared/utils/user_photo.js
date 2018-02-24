import _ from 'lodash';

export default (user, preference = 'square') => _.get(user, `${preference}.location`) || _.get(user, preference) || '/blank.gif';
