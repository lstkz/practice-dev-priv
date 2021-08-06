import { WorkspaceNodeCollection } from '../../src/collections/WorkspaceNode';
import { deleteWorkspaceNode } from '../../src/contracts/workspace/deleteWorkspaceNode';
import { execContract, getUUID, setupDb } from '../helper';
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
    execContract(deleteWorkspaceNode, { id: getUUID(1123) }, 'user1_token')
  ).rejects.toMatchInlineSnapshot(`[AppError: Node not found]`);
});

it('should throw if no permission', async () => {
  await expect(
    execContract(deleteWorkspaceNode, { id: getUUID(1) }, 'user2_token')
  ).rejects.toMatchInlineSnapshot(
    `[ForbiddenError: Not permission to access this workspace]`
  );
});

it('should throw if locked', async () => {
  const node = await WorkspaceNodeCollection.findByIdOrThrow(getUUID(1));
  node.isLocked = true;
  await WorkspaceNodeCollection.update(node, ['isLocked']);
  await expect(
    execContract(deleteWorkspaceNode, { id: getUUID(1) }, 'user1_token')
  ).rejects.toMatchInlineSnapshot(`[AppError: Cannot remove locked node]`);
});

it('should delete a node', async () => {
  await execContract(deleteWorkspaceNode, { id: getUUID(1) }, 'user1_token');
  expect(await _getAllIds()).toMatchInlineSnapshot(`
    Array [
      "00000000-0000-4000-8000-000000000002",
      "00000000-0000-4000-8000-000000000003",
      "00000000-0000-4000-8000-000000000004",
    ]
  `);
});

it('should delete a directory and its children', async () => {
  await execContract(deleteWorkspaceNode, { id: getUUID(2) }, 'user1_token');
  expect(await _getAllIds()).toMatchInlineSnapshot(`
    Array [
      "00000000-0000-4000-8000-000000000001",
    ]
  `);
});
