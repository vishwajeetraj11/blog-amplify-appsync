import { withAuthenticator } from 'aws-amplify-react';
import CreatePostForm from '../CreatePostForm';
import Posts from '../Posts';
import './App.scss';

function App() {
	return (
		<div className='App'>
			<CreatePostForm />
			<Posts />
		</div>
	);
}

export default withAuthenticator(App, {
	includeGreetings: true,
});
