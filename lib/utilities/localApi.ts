import path from 'path'
import fs from 'fs/promises'

export async function getLocalJsonFile(folderPath: string, fileName: string){
  const filePath = path.join(process.cwd(), folderPath, fileName)
  const jsonData: any = await fs.readFile(filePath,  'utf-8',)
  return JSON.parse(jsonData)
}
