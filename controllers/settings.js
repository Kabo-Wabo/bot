const Scene = require('telegraf/scenes/base')
class SceneGenerator {
    GenAgeScene (){
        const addscene = new Scene ('age')
        addscene.enter(async(ctx)=>{
            await ctx.reply('Hi')
        })
        addscene.on('text', async(ctx) => {
            if (addscene) {
                await ctx.reply('Thx')
                ctx.scene.leave()
            }
        })
    }
}
module.exports = GenAgeScene