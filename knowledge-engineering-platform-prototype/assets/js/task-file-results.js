// Prototype result fixtures; replace with per-file extraction responses when integrating the backend.
export function createTaskFileResult(name) {
  const fixed = /固定资产/.test(name);
  if (!/对公授信|固定资产贷款/.test(name)) return { name, values: { summary: '', domain: '', category: '', scenario: '', department: '', security: '', tags: [] }, evidence: '' };
  return { name, values: {
    summary: fixed ? '规范固定资产贷款调查、审查、审批与贷后管理流程' : '明确客户准入、财务分析、担保审查及贷后管理等关键控制要求',
    domain: '信贷业务', category: fixed ? '固定资产贷款' : '对公授信审查', scenario: fixed ? '项目融资申请与固定资产贷款审查' : '企业客户授信申请、审查与存量授信复审',
    department: '授信审批部', security: '内部公开', tags: fixed ? ['固定资产贷款', '制度办法', '风险管理'] : ['对公授信', '风险管理', '制度办法']
  }, evidence: fixed ? '' : '第一条 为规范本行对公授信业务审查工作，加强授信风险管理，提高授信决策质量，根据国家有关法律法规及本行风险管理制度，制定本办法。' };
}
