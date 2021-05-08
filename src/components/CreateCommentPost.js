import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { createComment } from '../graphql/mutations';

const CreateCommentPost = (props) => {
	const [commentOwnerId, setCommentOwnerId] = useState('');
	const [commentOwnerUsername, setCommentOwnerUsername] = useState('');
	const [content, setContent] = useState('');

	useEffect(() => {
		(async () => {
			await Auth.currentUserInfo().then((user) => {
				setCommentOwnerId(user.attributes.sub);
				setCommentOwnerUsername(user.username);
			});
		})();
	}, []);

	const handleCommentChange = (e) => {
		setContent(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const input = {
			commentPostId: props.postId,
			commentOwnerId,
			commentOwnerUsername,
			content,
			createdAt: new Date().toISOString(),
		};
		await API.graphql(graphqlOperation(createComment, { input }));

		setContent('');
	};

	return (
		<div>
			<form className='add-comment' onSubmit={handleSubmit}>
				<textarea
					type='text'
					name='content'
					rows='3'
					cols='40'
					required
					placeholder='Add Your Comment...'
					value={content}
					onChange={handleCommentChange}
				/>

				<input
					className='btn'
					type='submit'
					style={{ fontSize: '19px' }}
					value='Add Comment'
				/>
			</form>
		</div>
	);
};

export default CreateCommentPost;
