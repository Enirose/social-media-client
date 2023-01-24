import { login } from './login';

class LocalStorageMock {
  constructor() {
    this.value = {};
  }

  getItem(key) {
    return this.value[key] || null;
  }

  setItem(key, value) {
    this.value[key] = String(value);
  }

  clear() {
    this.value = {};
  }

  removeItem(key) {
    delete this.value[key];
  }
}

global.localStorage = new LocalStorageMock();

const Email = 'enirose@noroff.no';
const Password = 'enirose123';

const User = {
  name: 'Eni123',
  email: Email,
};

const UserProfile = JSON.stringify(User);

function loginSuccess() {
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(UserProfile),
  });
}

function loginFailed() {
  return Promise.resolve({
    ok: false,
    status: 404,
    statusText: 'Not Found',
  });
}

describe('login', () => {
  it('returns a valid token when provided with valid credentials', async () => {
    global.fetch = jest.fn(() => loginSuccess());
    const profile = await login(Email, Password);
    const profileData = JSON.stringify(profile);
    expect(Email).toMatch('[w-.]+@(stud.)?noroff.no$');
    expect(Password).toHaveLength(8);
    expect(profileData).toMatch(UserProfile);
  });

  it('throws an error when provided with invalid credentials', async () => {
    global.fetch = jest.fn(() => loginFailed());
    await expect(login()).rejects.toThrow('Invalid credentials');
  });
});
