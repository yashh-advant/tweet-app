import { useMutation } from '@tanstack/react-query';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { addTweet } from '../../services/tweets.service';
import queryClient from '../../lib/QueryClient';

function AddTweet({ ref }) {
  const dialog = useRef(null);
  const [tweetDetails, setTweetDetails] = useState({
    content: '',
    title: '',
  });

  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: addTweet,
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: ['my-tweets'] });

      const prevData = queryClient.getQueryData(['my-tweets']);
      // console.log(prevData);

      queryClient.setQueryData(['my-tweets'], old => ({
        ...old,
        data: [...(old?.data || []), data],
      }));
      return { prevData };
    },
    onError: (err, data, { prevData }) => {
      // console.log(prevData);
      queryClient.setQueriesData(['my-tweets', prevData]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tweets'] });
      dialog.current.close();
    },
  });

  const hanldeSubmit = event => {
    event.preventDefault();
    mutate(tweetDetails);
  };

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },
    };
  });

  const handleCloseModal = () => {
    dialog.current.close();
  };

  const handleTweetChange = (identifier, value) => {
    setTweetDetails(prev => ({ ...prev, [identifier]: value }));
  };
  return (
    <>
      <dialog className=" bg-transparent  min-h-screen min-w-screen   " ref={dialog}>
        <div
          className="bg-transparent  flex justify-center   items-center z-10 min-h-screen min-w-full"
          onClick={handleCloseModal}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={hanldeSubmit}
            className="flex md:w-[400px] z-20 w-[350px] lg:max-w-md flex-col gap-5 rounded-2xl border border-gray-700 bg-gray-800 p-8 text-white shadow-lg"
          >
            <p className="text-center text-2xl font-semibold">Add Tweet</p>

            <div className="flex flex-col gap-2">
              <label className="text-sm ml-1 text-gray-300" htmlFor="title">
                Title
              </label>
              <input
                className="w-full rounded-xl border border-gray-600 bg-gray-900 p-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="title"
                value={tweetDetails.title}
                onChange={event => handleTweetChange('title', event.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm ml-1 text-gray-300" htmlFor="content">
                Content
              </label>
              <input
                className="w-full rounded-xl border border-gray-600 bg-gray-900 p-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="content"
                value={tweetDetails.content}
                onChange={event => handleTweetChange('content', event.target.value)}
                required
              />
            </div>

            {isError && (
              <p className="text-sm text-red-400">{error.message || 'Failed to add tweet'}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              {!isPending ? (
                <>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-xl border border-gray-500 px-4 py-2 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </button>

                  <button className="rounded-xl bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:opacity-50">
                    Add Tweet
                  </button>
                </>
              ) : (
                <p className="text-gray-300">Adding Tweet...</p>
              )}
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default AddTweet;
