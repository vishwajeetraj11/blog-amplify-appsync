import API, { graphqlOperation } from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import React, { useEffect, useState } from 'react';
import { updatePost } from '../graphql/mutations';

const EditPost = (props) => {
	const [show, setShow] = useState(false);
	const [id, setId] = useState(props.id);
	const [postOwnerId, setPostOwnerId] = useState('');
	const [postOwnerUsername, setPostOwnerUsername] = useState('');
	const [postTitle, setPostTitle] = useState('');
	const [postBody, setPostBody] = useState('');
	const [postData, setPostData] = useState({
		postTitle: props.postTitle,
		postBody: props.postBody,
	});

	const handleModal = () => {
		setShow((p) => !p);
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	};

	useEffect(() => {
		(async () => {
			try {
				await Auth.currentUserInfo().then((user) => {
					setPostOwnerId(user.attributes.sub);
					setPostOwnerUsername(user.username);
				});
			} catch (e) {}
		})();
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		const input = {
			id,
			postOwnerId,
			postOwnerUsername,
			postTitle: postData.postTitle,
			postBody: postData.postBody,
		};

		await API.graphql(graphqlOperation(updatePost, { input }));

		//force close the modal
		setShow((p) => !p);
	};

	const handleTitle = (e) => {
		const title = e.target.value;
		setPostData((p) => ({
			...p,
			postTitle: title,
		}));
	};

	const handleBody = (e) => {
		const body = e.target.value;
		setPostData((p) => ({
			...p,
			postBody: body,
		}));
	};

	return (
		<>
			{show && (
				<div className='modal'>
					<button className='close' onClick={handleModal}>
						X
					</button>
					<form onSubmit={onSubmit} className='add-post'>
						<input
							style={{ fontSize: '19px' }}
							type='text'
							placeholder='Title'
							name='postTitle'
							value={postData.postTitle}
							onChange={handleTitle}
						/>

						<input
							style={{ height: '150px', fontSize: '19px' }}
							type='text'
							name='postBody'
							value={postData.postBody}
							onChange={handleBody}
						/>
						<input type='submit' name='Update Post' />
					</form>
				</div>
			)}
			<button
				onClick={handleModal}
				style={{ float: 'none', marginRight: 15 }}
			>
				Edit
			</button>
		</>
	);
};

export default EditPost;
