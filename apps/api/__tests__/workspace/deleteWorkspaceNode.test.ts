import { WorkspaceNodeCollection } from '../../src/collections/WorkspaceNode';
import { deleteWorkspaceNode } from '../../src/contracts/workspace/deleteWorkspaceNode';
import { getAppUser, getUUID, setupDb } from '../helper';
import {
  createSampleChallenges,
  createSampleWorkspaceItems,
  createSampleWorkspaces,
  registerSampleUsers,
} from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  await createSampleWorkspaces();
  await createSampleWorkspaceItems();
});

async function _getAllIds() {
  const nodes = await WorkspaceNodeCollection.findAll({});
  return nodes.map(x => x._id);
}

it('should throw if no found', async () => {
  await expect(
    deleteWorkspaceNode(await getAppUser(2), getUUID(1123))
  ).rejects.toMatchInlineSnapshot(`[AppError: Node not found]`);
});

it('should throw if no permission', async () => {
  await expect(
    deleteWorkspaceNode(await getAppUser(2), getUUID(1))
  ).rejects.toMatchInlineSnapshot(
    `[ForbiddenError: Not permission to access this workspace]`
  );
});

it('should delete a node', async () => {
  await deleteWorkspaceNode(await getAppUser(1), getUUID(1));
  expect(await _getAllIds()).toMatchInlineSnapshot(`
Array [
  "00000000-0000-4000-8000-000000000002",
  "00000000-0000-4000-8000-000000000003",
  "00000000-0000-4000-8000-000000000004",
]
`);
});

it('should delete a directory and its children', async () => {
  await deleteWorkspaceNode(await getAppUser(1), getUUID(2));
  expect(await _getAllIds()).toMatchInlineSnapshot(`
Array [
  "00000000-0000-4000-8000-000000000001",
]
`);
});
