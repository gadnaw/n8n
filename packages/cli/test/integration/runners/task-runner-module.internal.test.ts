import { TaskRunnersConfig } from '@n8n/config';
import Container from 'typedi';

import { TaskRunnerModule } from '@/runners/task-runner-module';

import { InternalTaskRunnerDisconnectAnalyzer } from '../../../src/runners/internal-task-runner-disconnect-analyzer';
import { TaskRunnerWsServer } from '../../../src/runners/runner-ws-server';

describe('TaskRunnerModule in internal_childprocess mode', () => {
	const runnerConfig = Container.get(TaskRunnersConfig);
	runnerConfig.port = 0; // Random port
	runnerConfig.mode = 'internal_childprocess';
	const module = Container.get(TaskRunnerModule);

	afterEach(async () => {
		await module.stop();
	});

	describe('start', () => {
		it('should throw if the task runner is disabled', async () => {
			runnerConfig.disabled = true;

			// Act
			await expect(module.start()).rejects.toThrow('Task runner is disabled');
		});

		it('should start the task runner', async () => {
			runnerConfig.disabled = false;

			// Act
			await module.start();
		});

		it('should use InternalTaskRunnerDisconnectAnalyzer', () => {
			const wsServer = Container.get(TaskRunnerWsServer);

			expect(wsServer.getDisconnectAnalyzer()).toBeInstanceOf(InternalTaskRunnerDisconnectAnalyzer);
		});
	});
});
