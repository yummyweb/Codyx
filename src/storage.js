import { v4 as uuid } from 'uuid';
import { userSession } from './auth';
import { Storage } from '@stacks/storage';

const storage = new Storage({ userSession });
const TASKS_FILENAME = 'tasks.json';

// @type {Task[]}
export const defaultInfo = [
  {
    name: '',
    email: '',
    age: '',
    gender: '',
    file: '',
    id: uuid(),
  },
];

/**
 * Save tasks to Gaia
 * @param {UserSession} userSession
 * @param {Todo[]} tasks
 * @param {boolean} isPublic
 */
export const saveInfo = async (userSession, info, isPublic) => {
  await storage.putFile(TASKS_FILENAME, JSON.stringify({ info, isPublic }), {
    encrypt: !isPublic,
    dangerouslyIgnoreEtag: true,
  });
};

/**
 * Fetch tasks for a specific user. Omit the `username` argument to fetch the current user's tasks.
 *
 * If no tasks are found, and no username is provided, then the default tasks are returned.
 * If tasks are found, we check to see if they are public.
 * @param {import("@stacks/auth").UserSession} userSession
 * @param {string} username - the username to fetch tasks for. Omit this argument or set it to an empty string
 * to fetch the current user's tasks.
 * @returns {{ tasks: Task[] | null, public: boolean }}
 */
export const fetchTasks = async (userSession, username) => {
  try {
    /** @type {string} raw JSON stored in Gaia */
    const tasksJSON = await storage.getFile(TASKS_FILENAME, {
      decrypt: false,
      username: username || undefined,
    });
    if (tasksJSON) {
      const json = JSON.parse(tasksJSON);
      if (json.isPublic) {
        return {
          info: json.info,
          public: true,
        };
      } else {
        if (!username) {
          const decrypted = JSON.parse(await userSession.decryptContent(tasksJSON));
          return {
            info: decrypted.info,
            public: false,
          };
        }
      }
    } else {
      return {
        info: username ? null : defaultInfo,
        public: false,
      };
    }
  } catch (error) {
    if (username) {
      return {
        info: null,
      };
    } else {
      return {
        info: defaultInfo,
      };
    }
  }
};
