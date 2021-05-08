import API, { graphqlOperation } from '@aws-amplify/api';
import React from 'react';
import { deletePost } from './graphql/mutations';

const DeletePost = ({ post }) => {
	const { id } = post;

	const handleDeletePost = async () => {
		const input = {
			id,
		};
		try {
			await API.graphql(graphqlOperation(deletePost, { input }));
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<button onClick={handleDeletePost} style={{ float: 'none' }}>
			Delete
		</button>
	);
};

export default DeletePost;
