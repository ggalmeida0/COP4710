//Will implement these tests:

test('Sign up user (insert new user in the database)', () => {
  const mockDb = {};
  const query = `

  `;
  const expectedOuput = {};
  expect(mockDb).toBe();
});

test('Update user info (modify user information in the database)', () => {
  const mockDb = {};
  const query = `

  `;
  const expectedOuput = {};
  expect(true).toBe(true);
});

test('Delete user (delete user from database)', () => {
  const mockDb = {};
  const query = `

  `;
  const expectedOuput = {};
  expect(true).toBe(true);

  expect(true).toBe(true);
});

test('Login function (returns user on right email + password combination)', () => {
  const mockDb = {};
  const query = `

  `;
  const expectedOuput = {};
  expect(true).toBe(true);
  expect(true).toBe(true);
});


type Mutation {
    createUser(user: User!)
    updateUser(userId:ID!)
    deleteUser(userId:ID!)
}

type Query {
    getUser(email:String! passwordHash:String!)
}