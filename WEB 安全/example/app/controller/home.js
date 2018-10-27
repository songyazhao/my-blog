'use strict';

const Controller = require('egg').Controller;
const POSTS = 'posts';

class HomeController extends Controller {
  async homePage() {
    await this.ctx.render('index.html');
  }


  async contentPage() {
    const { id } = this.ctx.query;
    const { content } = await this.app.mysql.get(POSTS, { id });
    this.ctx.body = await this.ctx.renderString(content);
  }

  // - Reflected XSS 演示
  async search() {
    const { searchValue } = this.ctx.query;
    this.ctx.body = searchValue;
    // this.ctx.body = '<script>alert(\'hello xiaoming\')</script>';
  }

  async save() {
    const { content } = this.ctx.request.body;
    const result = await this.app.mysql.insert(POSTS, { content });
    if (result.affectedRows === 1) {
      this.ctx.body = {
        code: 0,
        msg: 'ok',
        data: { id: result.insertId },
      };
    } else {
      throw new Error('数据插入失败');
    }
  }
}

module.exports = HomeController;
