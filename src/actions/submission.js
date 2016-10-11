import formiojs from 'formiojs';

export const SUBMISSION_REQUEST = 'SUBMISSION_REQUEST';
function requestSubmission(name, src) {
  return {
    type: SUBMISSION_REQUEST
  };
}

export const SUBMISSION_SUCCESS = 'SUBMISSION_SUCCESS';
function receiveSubmission(name, submission) {
  return {
    type: SUBMISSION_SUCCESS,
    name,
    submission
  };
}

export const SUBMISSION_FAILURE = 'SUBMISSION_FAILURE';
function failSubmission(name, err) {
  return {
    type: SUBMISSION_FAILURE,
    name,
    error: err
  };
}

export const SUBMISSIONS_REQUEST = 'SUBMISSIONS_REQUEST';
function requestSubmissions(name, page) {
  return {
    type: SUBMISSIONS_REQUEST,
    name,
    page
  };
}

export const SUBMISSIONS_SUCCESS = 'SUBMISSIONS_SUCCESS';
function receiveSubmissions(name, submissions) {
  return {
    type: SUBMISSIONS_SUCCESS,
    submissions,
    name
  };
}

export const SUBMISSIONS_FAILURE = 'SUBMISSIONS_FAILURE';
function failSubmissions(name, err) {
  return {
    type: SUBMISSIONS_FAILURE,
    error: err,
    name
  };
}

export const SubmissionActions = {
  fetch: (name, id) => {
    return (dispatch, getState) => {
      // Check to see if the submission is already loaded.
      if (getState().id === id) {
        return;
      }

      dispatch(requestSubmission(name, id));

      const formio = formiojs(getState().formio[name].form.src + '/submission/' + id);

      formio.loadSubmission()
        .then((result) => {
          dispatch(receiveSubmission(name, result));
        })
        .catch((result) => {
          dispatch(failSubmission(name, result));
        });
    };
  },
  index: (name, page = 1) => {
    return (dispatch, getState) => {
      dispatch(requestSubmissions(name, page));
      const submissions = getState().formio[name].submissions;

      let params = {};
      if (parseInt(submissions.limit) !== 10) {
        params.limit = submissions.limit;
      }
      if (page !== 1) {
        params.skip = ((parseInt(page) - 1) * parseInt(submissions.limit));
        params.limit = parseInt(submissions.limit);
      }
      const formio = formiojs(submissions.src);

      formio.loadSubmissions({ params })
        .then((result) => {
          dispatch(receiveSubmissions(name, result));
        })
        .catch((result) => {
          dispatch(failSubmissions(name. result));
        });
    };
  }
};
