class Repository {

    constructor(config) {
        this.config = config;
    }

    _normalizeData(response = { w: 31, t: 32, p: 1024 }) {
        // TODO: Fix me.
        return Object.keys(this.config.dataModel).map( key => ({
            [key]: response[this.config.dataModel[key]]
        }));
    }

    /**
     * Checks weather the data is up to date or not.
     * @return {Boolean}
     */
    _isDataUpToDate(_localStore) {
        const isDataMissing =
            _localStore === null || Object.keys(_localStore.data).length === 0;

        if (isDataMissing) {
            return false;
        }

        const { lastFetched } = _localStore;
        const updateLimit = 15 * 1000; // 15 minutes

        const isLimitExceeded =
            (new Date().valueOf() - lastFetched) > updateLimit;

        return isLimitExceeded;
    }

    _storeData(_data) {
        window.localStorage.setItem(this.config.name, JSON.stringify({
            lastFetched: new Date().valueOf(),
            data: _data
        }));
    }

    /**
     * Get current weather.
     * @return {Promise}
     */
    init(){
        const localData = JSON.parse( window.localStorage.getItem(this.name) );

        if (this._isDataUpToDate(localData)) {
            return new Promise(_resolve => _resolve(localData));
        }

        return this.config.request
            .then(this._normalizeData.bind(this))
            .then(this._storeData.bind(this));
    }
};
