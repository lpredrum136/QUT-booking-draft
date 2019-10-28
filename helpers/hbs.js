module.exports = {
    select: function (selected, options) {// Re render the form to edit story, see routes/stories.js
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"')
            .replace(new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
    }
};