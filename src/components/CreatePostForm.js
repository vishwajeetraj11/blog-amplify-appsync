import API, { graphqlOperation } from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import React, { useEffect, useState } from 'react';
import { createPost } from '../graphql/mutations';

const CreatePostForm = () => {
	const [postTitle, setPostTitle] = useState('');
	const [postBody, setBody] = useState('');
	const [postOwnerId, setPostOwnerId] = useState('');
	const [postOwnerUsername, setPostOwnerUsername] = useState('');

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const input = {
				postOwnerId,
				postOwnerUsername,
				postTitle,
				postBody,
				createdAt: new Date().toISOString(),
			};
			await API.graphql(graphqlOperation(createPost, { input }));

			setPostTitle('');
			setBody('');
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		(async () => {
			const user = await Auth.currentUserInfo();
			setPostOwnerUsername(user.username);
			setPostOwnerId(user.attributes.sub);
		})();
	}, []);

	return (
		<form onSubmit={onSubmit} className='add-post'>
			<input
				style={{ font: '19px' }}
				type='text'
				placeholder='Title'
				name='postTitle'
				required
				value={postTitle}
				onChange={(e) => setPostTitle(e.target.value)}
			/>
			<textarea
				style={{ font: '19px' }}
				type='text'
				cols='40'
				rows='3'
				placeholder='New Blog Post'
				name='postBody'
				required
				value={postBody}
				onChange={(e) => setBody(e.target.value)}
			/>
			<input type='submit' className='btn' style={{ font: '19px' }} />
		</form>
	);
};

export default CreatePostForm;
