export default {
  getTableData(req, res) {
    res.json({
      data: [{
        id: '1',
        firstName: '赵',
        lastName: '大',
        age: 7,
        grade: '一年级',
      }, {
        id: '2',
        firstName: '钱',
        lastName: '二',
        age: 8,
        grade: '二年级',
      }, {
        id: '3',
        firstName: '李',
        lastName: '四',
        age: 8,
        grade: '二年级',
      }, {
        id: '4',
        firstName: '周',
        lastName: '5⃣️',
        age: 8,
        grade: '二年级',
      }, {
        id: '5',
        firstName: '孙',
        lastName: '三',
        age: 9,
        grade: '三年级',
      }],
    });
  },
};
