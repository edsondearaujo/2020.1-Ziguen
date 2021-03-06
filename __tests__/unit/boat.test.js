import request from 'supertest'
import app from '../../src/app'
import bcrypt from 'bcryptjs'
import truncate from '../util/truncate'
import factory from '../factores'


describe('Boat', () => {
    beforeEach(async() =>{
    await truncate();
    })
})

async function adminSession() {
    const user = (await factory.create('Admin')).dataValues;

    const session = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });


    return session.body.token;
}


describe('Create', () => {
    it('return status 200 to successful', async() => {

        const admin = await factory.attrs('Admin');
        await request(app).post('/admins').send(admin);

        const boat = await factory.attrs('Boat',{
            user_id: 1
        });

        const response = await request(app).post('/boats').send(boat);

        expect(response.status).toBe(200);
    })
    it('return status 400 to failure', async() => {
        
        const admin = await factory.attrs('Admin');
        await request(app).post('/admins').send(admin);
        
        const boat = await factory.attrs('Boat')

        const response = await request(app).post('/boats').send(boat);

        expect(response.status).toBe(400);
    })
    it('If the boat does not exist return status 500', async() => {
        
        const admin = await factory.attrs('Admin');
        await request(app).post('/admins').send(admin);
        
        const boat = await factory.attrs('Boat',{
            user_id: 999999
        });

        const response = await request(app).post('/boats').send(boat);

        expect(response.status).toBe(400);
    })
})

describe('index', () => {
    it("list all boat and return status 200 to successful", async() => {

        await factory.attrs('Boat');
            const response = await request(app)
                .get('/boats')
                .set('authorization', `Bearer ${await adminSession()}`)
            expect(response.status).toBe(200);
    })
})

describe('delete', () => {
    it('returns status 500 to failure', async() => {
        
        const admin = await factory.attrs('Admin');
        await request(app).post('/admins').send(admin);

        const boat = await factory.attrs('Boat',{
            user_id: 1
        });
        await request(app).post('/boats').send(boat);
            
        const response = await request(app)
            .delete('/boats')
            .set('authorization', `Bearer ${await adminSession()}`)
        expect(response.status).toBe(500);
    })
})
