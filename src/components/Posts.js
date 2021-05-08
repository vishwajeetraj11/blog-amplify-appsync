import React, { useEffect, useState } from 'react';
import { listPosts } from '../graphql/queries';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import DeletePost from '../DeletePost';
import EditPost from './EditPost';
import {
	onCreateComment,
	onCreateLike,
	onCreatePost,
	onDeletePost,
	onUpdatePost,
} from '../graphql/subscriptions';
import CreateCommentPost from './CreateCommentPost';
import CommentPost from './CommentPost';
import { FaThumbsUp } from 'react-icons/fa';
import { createLike } from '../graphql/mutations';

const Posts = () => {
	const [posts, setPosts] = useState([]);
	const [ownerId, setOwnerId] = useState('');
	const [ownerUsername, setOwnerUsername] = useState('');
	const [isHovering, setIsHovering] = useState(false);

	const [errorMessage, setErrorMessage] = useState('');
	const [postLikedBy, setPostLikedBy] = useState('');
	const listeners = {};

	useEffect(() => {
		const postsData = async () => {
			try {
				await Auth.currentUserInfo().then((user) => {
					setOwnerId(user.attributes.sub);
					setOwnerUsername(user.username);
				});

				const result = await API.graphql(graphqlOperation(listPosts));
				setPosts(result.data.listPosts.items);

				// Subscription - on Create Post
				listeners.createPostListener = API.graphql(
					graphqlOperation(onCreatePost)
				).subscribe({
					next: (postData) => {
						const newPost = postData.value.data.onCreatePost;
						setPosts((previousPosts) => {
							const filteredPosts = previousPosts.filter(
								(post) => {
									return post.id !== newPost.id;
								}
							);
							return [newPost, ...filteredPosts];
						});
					},
				});

				// Subscription - on Delete Post
				listeners.deletePostListener = API.graphql(
					graphqlOperation(onDeletePost)
				).subscribe({
					next: (postData) => {
						const deletedPost = postData.value.data.onDeletePost;
						setPosts((previousPosts) => {
							const filteredPosts = previousPosts.filter(
								(post) => {
									return post.id !== deletedPost.id;
								}
							);
							return filteredPosts;
						});
					},
				});

				// Subscription - on Update Post
				listeners.updatePostListener = API.graphql(
					graphqlOperation(onUpdatePost)
				).subscribe({
					next: (postData) => {
						const updatedPost = postData.value.data.onUpdatePost;
						setPosts((previousPosts) => {
							const index = previousPosts.findIndex(
								(post) => post.id === updatedPost.id
							);
							const updatedPosts = [
								...previousPosts.slice(0, index),
								updatedPost,
								...previousPosts.slice(index + 1),
							];
							return updatedPosts;
						});
					},
				});

				// Subscription - on Create Comment Post
				listeners.createPostCommentListener = API.graphql(
					graphqlOperation(onCreateComment)
				).subscribe({
					next: (commentData) => {
						const createdComment =
							commentData.value.data.onCreateComment;

						setPosts((previousPosts) => {
							let posts = [...previousPosts];
							for (let post of posts) {
								if (createdComment.post.id === post.id) {
									post.comments.items.push(createdComment);
								}
							}
							return posts;
						});
					},
				});

				// Subscription - on Create Comment Post
				listeners.createPostLikeListener = API.graphql(
					graphqlOperation(onCreateLike)
				).subscribe({
					next: (postData) => {
						const createdLike = postData.value.data.onCreateLike;

						setPosts((previousPosts) => {
							let posts = [...previousPosts];
							for (let post of posts) {
								if (createdLike.post.id === post.id) {
									post.likes.items.push(createdLike);
								}
							}
							return posts;
						});
					},
				});
			} catch (e) {
				console.log(e);
			}
		};
		postsData();

		return () => {
			listeners.createPostListener.unsubscribe();
			listeners.deletePostListener.unsubscribe();
			listeners.updatePostListener.unsubscribe();
			listeners.createPostCommentListener.unsubscribe();
			listeners.createPostLikeListener.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const likedPost = (postId) => {
		for (let post of posts) {
			if (post.id === postId) {
				if (post.postOwnerId === ownerId) return true;
				for (let like of post.likes.items) {
					if (like.likeOwnerId === ownerId) {
						return true;
					}
				}
			}
		}
		return false;
	};

	const handleLike = async (id) => {
		if (likedPost(id)) {
			return setErrorMessage(`Can't like your own Post.`);
		} else {
			try {
				const input = {
					numberLikes: 1,
					likeOwnerId: ownerId,
					likeOwnerUsername: ownerUsername,
					likePostId: id,
				};
				const result = await API.graphql(
					graphqlOperation(createLike, { input })
				);
				console.log(result.data);
			} catch (e) {
				console.log(e);
			}
		}
	};

	return posts.map((post) => (
		<div style={rowStyle} key={post.id} className='post'>
			<h1>{post.postTitle}</h1>
			<span
				style={{
					display: 'block',
					fontStyle: 'italic',
					color: '#0ca5e297',
				}}
			>
				Written By: {post.postOwnerUsername}
			</span>
			<time
				style={{
					display: 'block',
					fontStyle: 'italic',
				}}
			>{` ${new Date(post.createdAt).toDateString()} `}</time>
			<p>{post.postBody}</p>
			<span style={{ display: 'flex', justifyContent: 'flex-end' }}>
				{post.postOwnerId === ownerId && <EditPost {...post} />}
				{post.postOwnerId === ownerId && <DeletePost post={post} />}

				<span
					style={{
						order: -1,
						marginRight: 20,
						justifySelf: 'flex-start',
					}}
				>
					<p className='alert'>
						{post.postOwnerId === ownerId && errorMessage}
					</p>
					<p
						style={{ cursor: 'pointer' }}
						onClick={() => handleLike(post.id)}
					>
						<FaThumbsUp />
						{post?.likes?.items?.length}
					</p>
				</span>
			</span>
			<span>
				<CreateCommentPost postId={post.id} />
				{post?.comments?.items?.length > 0 && (
					<span style={{ fontSize: '19px', color: 'gray' }}>
						Comments:{' '}
					</span>
				)}
				{post?.comments?.items?.map((comment, index) => (
					<CommentPost key={index} commentData={comment} />
				))}
			</span>
		</div>
	));
};

const rowStyle = {
	background: '#f4f4f4',
	padding: '10px',
	border: '1px #ccc dotted',
	margin: '14px',
};

export default Posts;
