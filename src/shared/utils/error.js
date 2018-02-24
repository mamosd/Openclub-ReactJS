import Modal from 'antd/lib/modal';

const stripGraphQL = s => s.replace('GraphQL error: ', '');

export const parse = error => typeof error === 'string' ? stripGraphQL(error) : stripGraphQL(error.message);

export const display = error => Modal.error({ title: 'Uh-oh!', content: parse(error) });

export default parse;
