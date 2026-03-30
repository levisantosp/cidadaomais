import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '@/plugins/auth-plugin'
import { db, schema } from 'db'  
import { eq } from 'drizzle-orm'

export const editEntity = new Elysia()
  .use(authPlugin)
 .put('/entities/:id', async ({ params, body, set }) => {
      try {
        const result = await db
          .update(schema.entity)
          .set({
            name: body.name,
          })
          .where(eq(schema.entity.id, params.id))
          .returning()

        if (result.length === 0) {
          set.status = 404
          return { message: 'Entidade não encontrada.' }
        }

        return { message: 'Atualizado!', data: result }
        // -----------------------------------------
      } catch (error) {
        console.error('Erro ao atualizar:', error)
        set.status = 500
        return { message: 'Erro interno ao salvar no banco.' }
      }
    }, {
    authorize: ['Administrator'],
    params: z.object({
      id: z.coerce.bigint()
    }),
    body: z.object({
      name: z.string().min(2).optional() 
    })
  })
