import * as functions from 'firebase-functions';
import { propOr } from 'ramda';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const assignedToProp = propOr('', 'assignedTo');

export const setAssignedUserDetails = functions.firestore
  .document('/projects/{projectId}/tasks/{taskId}')
  .onWrite((change, context) => {
    const previousTaskVersion = change.before.data();
    const currentTaskVersion = change.after.data();

    const previouslyAssignedUserId = assignedToProp(previousTaskVersion);
    const newlyAssignedUserId = assignedToProp(currentTaskVersion);

    console.log('User Assigned Information: ', { previouslyAssignedUserId, newlyAssignedUserId });

    if (previouslyAssignedUserId === newlyAssignedUserId) {
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
