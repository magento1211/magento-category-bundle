import Post from './post';
import $ from 'jquery';

const router = require('pim/router');

class PostConfig implements Post {
    post(object: any): void {
        $.ajax({
            url: router.generate('flagbit_category.internal_api.category_config_post', { identifier: 1 }),
            type: 'POST',
            data: { config: JSON.stringify(object) },
        });
    }
}

export default new PostConfig();
