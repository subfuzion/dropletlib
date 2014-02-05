const sizes = [
  { id: 66,
    name: '512MB',
    slug: null,
    memory: 512,
    cpu: 1,
    disk: 20,
    cost_per_hour: 0.00744,
    cost_per_month: '5.0'
  }
];

const regions = [
  { id: 1,
    name: 'New York 1',
    slug: 'nyc1'
  },
  { id: 3,
    name: 'San Francisco 1',
    slug: 'sfo1'
  },
  { id: 4,
    name: 'New York 2',
    slug: 'nyc2'
  },
  { id: 5,
    name: 'Amsterdam 2',
    slug: 'ams2'
  }
];


module.exports = {
  size_id: sizes[0].id,      // 512 MB
  image_id: 2147090,         // node-002
  region_id: regions[1].id,  // sfo1
  ssh_key_id: 51999          // tony
};

