import * as functions from 'firebase-functions';
import { propOr } from 'ramda';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const assignedToProp = propOr('', 'assignedTo');

export const setAssignedUserDetails = functions
  .region('asia-northeast1')
  .firestore.document('/projects/{projectId}/tasks/{taskId}')
  .onWrite((change, context) => {
    if (!change.after.exists) {
      return false;
    }

    const previousTaskVersion = change.before.data();
    const currentTaskVersion = change.after.data();

    const previouslyAssignedUserId = assignedToProp(previousTaskVersion);
    const newlyAssignedUserId = assignedToProp(currentTaskVersion);

    console.log('User Assigned Information: ', {
      previouslyAssignedUserId,
      newlyAssignedUserId
    });

    const isUserIdTheSame = previouslyAssignedUserId === newlyAssignedUserId;

    if (!isUserIdTheSame && !newlyAssignedUserId) {
      return change.after.ref.set(
        {
          assignedUser: null
        },
        { merge: true }
      );
    }

    const doesTaskAlreadyHaveAssignedUserDetails = !(
      currentTaskVersion &&
      newlyAssignedUserId &&
      !currentTaskVersion.assignedUser
    );

    if (isUserIdTheSame && doesTaskAlreadyHaveAssignedUserDetails) {
      return false;
    }

    return db
      .doc(`users/${newlyAssignedUserId}`)
      .get()
      .then(snapshot => {
        const assignedUser = snapshot.data();
        console.log(`User Details (UID: ${newlyAssignedUserId})`, assignedUser);

        return change.after.ref.set(
          {
            assignedUser
          },
          { merge: true }
        );
      });
  });
