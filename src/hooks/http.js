import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (httpState, action) => {
	switch (action.type) {
		case 'SEND':
			return {
				loading: true, 
				error: null,
				data: null, 
				extra: null, 
				identifier: action.identifier 
			};
		case 'RESPONSE':
			return { 
				...httpState, 
				loading: false, 
				data: action.responseData, 
				extra: action.extra 
			}
		case 'ERROR':
			return { loading: false, error: action.errorMessage }
		case 'CLEAR_ERROR':
			return { ...httpState, error: null }
		default:
			throw new Error('Should not be reached!');
	}
}

const useFetch = () => {
	const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

	const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
		dispatchHttp({ type: 'SEND', identifier: reqIdentifier });

		fetch(url, {
				method: method,
				body: body,
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(response => {
					return response.json();
				})
				.then(responseData => {
					dispatchHttp({ 
						type: 'RESPONSE',
						responseData: responseData,
						extra: reqExtra 
					});
				})
				.catch(error => {
					dispatchHttp({ 
						type: 'ERROR',
						errorMessage: error.message 
					});
				});
	}, []);

	return {
		isLoading: httpState.loading,
		data: httpState.data,
		error: httpState.error,
		sendRequest: sendRequest,
		reqExtra: httpState.extra,
		reqIdentifier: httpState.identifier
	};
};

export default useFetch;