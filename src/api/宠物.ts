// Auto-generated by OpenAPI Generator

// Type Definitions
export interface UnknownType {
  code: number;
}

interface ApiError {
  code: number;
  message: string;
  type: string;
}

// Request Functions
/**
 * 查询宠物详情
 *
 * @method GET
 * @path /pet/{petId}
 *
 * @param {string} petId 宠物 ID (必需)
 *
 * @returns {Promise<any>} 响应数据
 * @response 200 无描述
 * @response 400 无描述
 * @response 404 无描述
 */
export async function getPetAsync(params: { petId: string }): Promise<UnknownType> {
  const response = await fetch(`/pet/${params.petId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
  }

  return response.json();
}

/**
 * 删除宠物信息
 *
 * @method DELETE
 * @path /pet/{petId}
 *
 * @param {string} petId Pet id to delete (必需)
 * @param {string} api_key  (可选)
 *
 * @returns {Promise<any>} 响应数据
 * @response 200 无描述
 */
export async function deletePetAsync(params: {
  petId: string;
  api_key?: string;
}): Promise<UnknownType> {
  const response = await fetch(`/pet/${params.petId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'api_key': `${params.api_key}`,
    },
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
  }

  return response.json();
}

/**
 * 新建宠物信息
 *
 * @method POST
 * @path /pet
 *
 *
 * @returns {Promise<any>} 响应数据
 * @response 201 无描述
 */
export async function postPetAsync(params: any): Promise<UnknownType> {
  const response = await fetch(`/pet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
  }

  return response.json();
}

/**
 * 修改宠物信息
 *
 * @method PUT
 * @path /pet
 *
 * @param {UnknownType} body 请求体
 *
 * @returns {Promise<any>} 响应数据
 * @response 200 无描述
 * @response 404 无描述
 * @response 405 无描述
 */
export async function putPetAsync(body: UnknownType): Promise<UnknownType> {
  const response = await fetch(`/pet`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
  }

  return response.json();
}

/**
 * 根据状态查找宠物列表
 *
 * @method GET
 * @path /pet/findByStatus
 *
 * @param {string} status Status values that need to be considered for filter (必需)
 *
 * @returns {Promise<any>} 响应数据
 * @response 200 无描述
 * @response 400 无描述
 */
export async function getFindByStatusAsync(params: { status: string }): Promise<any[]> {
  const response = await fetch(`/pet/findByStatus?status=${params.status}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
  }

  return response.json();
}
