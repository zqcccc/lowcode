import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { injectAssets } from '@alilc/lowcode-plugin-inject';
import assets from '../../services/assets.json';
import { getProjectSchema } from '../../services/mockService';
import { Message } from '@alifd/next';
import { request } from 'src/appHelper';
import { useWebsiteStore } from 'src/store/website';
const EditorInitPlugin = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      const { material, project, config } = ctx;
      const scenarioName = options['scenarioName'];
      const scenarioDisplayName = options['displayName'] || scenarioName;
      const scenarioInfo = options['info'] || {};
      // 保存在 config 中用于引擎范围其他插件使用
      config.set('scenarioName', scenarioName);
      config.set('scenarioDisplayName', scenarioDisplayName);
      config.set('scenarioInfo', scenarioInfo);

      // 设置物料描述

      await material.setAssets(await injectAssets(assets));
      const id = new URLSearchParams(location.search.slice(1)).get('id');
      let schema;
      try {
        if (id) {
          const res = await request(`/api/website/${id}`);
          const { config: configData, name } = await res.data;
          if (configData) {
            const { projectSchema: _projectSchema } = configData;
            schema = _projectSchema;
            useWebsiteStore.setState({ name: name });
          }
        }
      } catch (e) {
        Message.error({
          title: '获取项目配置失败，请联系开发人员',
          duration: 5000,
        });
        console.log('%c e: ', 'font-size:12px;background-color: #553E2E;color:#fff;', e);
      }
      if (!schema) {
        Message.warning({
          title: '远端无配置，尝试加载本地配置',
          duration: 5000,
        });
        schema = await getProjectSchema(scenarioName);
        useWebsiteStore.setState({ name: '本地网页' });
      }

      // 加载 schema
      project.importSchema(schema as any);
    },
  };
};
EditorInitPlugin.pluginName = 'EditorInitPlugin';
EditorInitPlugin.meta = {
  preferenceDeclaration: {
    title: '保存插件配置',
    properties: [
      {
        key: 'scenarioName',
        type: 'string',
        description: '用于localstorage存储key',
      },
      {
        key: 'displayName',
        type: 'string',
        description: '用于显示的场景名',
      },
      {
        key: 'info',
        type: 'object',
        description: '用于扩展信息',
      },
    ],
  },
};
export default EditorInitPlugin;
